import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

import * as puppeteer from 'puppeteer';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export class HtmlToPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTML to PDF',
		name: 'htmlToPdf',
		icon: 'file:htmltopdf.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Converte conteúdo HTML em arquivo PDF',
		defaults: {
			name: 'HTML to PDF',
			color: '#772244',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				placeholder: '<html><body><h1>Seu conteúdo HTML aqui</h1></body></html>',
				description: 'O conteúdo HTML que será convertido para PDF',
				required: true,
			},
			{
				displayName: 'Nome do Arquivo',
				name: 'fileName',
				type: 'string',
				default: 'documento.pdf',
				description: 'Nome do arquivo PDF que será gerado',
				required: true,
			},
			{
				displayName: 'Opções Avançadas',
				name: 'advancedOptions',
				type: 'collection',
				placeholder: 'Adicionar Opção',
				default: {},
				options: [
					{
						displayName: 'Formato da Página',
						name: 'format',
						type: 'options',
						options: [
							{
								name: 'A3',
								value: 'A3',
							},
							{
								name: 'A4',
								value: 'A4',
							},
							{
								name: 'A5',
								value: 'A5',
							},
							{
								name: 'Letter',
								value: 'Letter',
							},
							{
								name: 'Legal',
								value: 'Legal',
							},
							{
								name: 'Tabloid',
								value: 'Tabloid',
							},
						],
						default: 'A4',
						description: 'Formato da página do PDF',
					},
					{
						displayName: 'Orientação',
						name: 'landscape',
						type: 'boolean',
						default: false,
						description: 'Se verdadeiro, o PDF será gerado em modo paisagem',
					},
					{
						displayName: 'Incluir Background',
						name: 'printBackground',
						type: 'boolean',
						default: true,
						description: 'Se verdadeiro, inclui cores e imagens de fundo',
					},
					{
						displayName: 'Margens (em mm)',
						name: 'margin',
						type: 'fixedCollection',
						default: { marginValues: {} },
						options: [
							{
								displayName: 'Valores das Margens',
								name: 'marginValues',
								values: [
									{
										displayName: 'Superior',
										name: 'top',
										type: 'string',
										default: '10mm',
										description: 'Margem superior',
									},
									{
										displayName: 'Direita',
										name: 'right',
										type: 'string',
										default: '10mm',
										description: 'Margem direita',
									},
									{
										displayName: 'Inferior',
										name: 'bottom',
										type: 'string',
										default: '10mm',
										description: 'Margem inferior',
									},
									{
										displayName: 'Esquerda',
										name: 'left',
										type: 'string',
										default: '10mm',
										description: 'Margem esquerda',
									},
								],
							},
						],
					},
					{
						displayName: 'Salvar em Pasta Local',
						name: 'saveToFolder',
						type: 'boolean',
						default: false,
						description: 'Se verdadeiro, salva o PDF em uma pasta local além de retornar como binário',
					},
					{
						displayName: 'Caminho da Pasta',
						name: 'folderPath',
						type: 'string',
						default: '',
						placeholder: '/caminho/para/pasta',
						description: 'Caminho absoluto da pasta onde salvar o PDF (funciona apenas se "Salvar em Pasta Local" estiver ativado)',
						displayOptions: {
							show: {
								saveToFolder: [true],
							},
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		let browser: puppeteer.Browser | undefined;

		for (let i = 0; i < items.length; i++) {
			try {
				// Obter parâmetros
				const htmlContent = this.getNodeParameter('htmlContent', i) as string;
				const fileName = this.getNodeParameter('fileName', i) as string;
				const advancedOptions = this.getNodeParameter('advancedOptions', i, {}) as any;

				// Validar HTML
				if (!htmlContent || htmlContent.trim() === '') {
					throw new NodeOperationError(this.getNode(), 'Conteúdo HTML é obrigatório', {
						itemIndex: i,
					});
				}

				// Verificar se o HTML de entrada contém dados do item atual
				let processedHtml = htmlContent;
				if (items[i].json) {
					// Substituir placeholders simples no HTML com dados do item
					const itemData = items[i].json;
					for (const [key, value] of Object.entries(itemData)) {
						const placeholder = new RegExp(`{{${key}}}`, 'g');
						processedHtml = processedHtml.replace(placeholder, String(value));
					}
				}

				// Inicializar Puppeteer se ainda não foi
				if (!browser) {
					browser = await puppeteer.launch({
						headless: true,
						args: ['--no-sandbox', '--disable-setuid-sandbox'],
					});
				}

				const page = await browser.newPage();

				// Configurar conteúdo HTML
				await page.setContent(processedHtml, {
					waitUntil: 'networkidle0',
				});

				// Configurar opções do PDF
				const pdfOptions: puppeteer.PDFOptions = {
					format: (advancedOptions.format || 'A4') as puppeteer.PaperFormat,
					landscape: advancedOptions.landscape || false,
					printBackground: advancedOptions.printBackground !== false,
				};

				// Configurar margens se fornecidas
				if (advancedOptions.margin?.marginValues) {
					const margins = advancedOptions.margin.marginValues;
					pdfOptions.margin = {
						top: margins.top || '10mm',
						right: margins.right || '10mm',
						bottom: margins.bottom || '10mm',
						left: margins.left || '10mm',
					};
				}

				// Gerar PDF
				const pdfBuffer = await page.pdf(pdfOptions);
				await page.close();

				// Salvar em pasta local se solicitado
				if (advancedOptions.saveToFolder && advancedOptions.folderPath) {
					try {
						const folderPath = advancedOptions.folderPath;
						
						// Criar pasta se não existir
						if (!existsSync(folderPath)) {
							mkdirSync(folderPath, { recursive: true });
						}

						const fullPath = join(folderPath, fileName);
						writeFileSync(fullPath, pdfBuffer);
						
						// Adicionar informação sobre onde foi salvo
						returnData.push({
							json: {
								...items[i].json,
								savedToFile: true,
								filePath: fullPath,
								message: `PDF salvo com sucesso em: ${fullPath}`,
							},
							binary: {
								data: {
									data: Buffer.from(pdfBuffer).toString('base64'),
									mimeType: 'application/pdf',
									fileName: fileName,
								},
							},
						});
					} catch (error: any) {
						throw new NodeOperationError(
							this.getNode(),
							`Erro ao salvar arquivo na pasta: ${error.message}`,
							{ itemIndex: i }
						);
					}
				} else {
					// Retornar apenas como binário
					returnData.push({
						json: {
							...items[i].json,
							message: 'PDF gerado com sucesso',
						},
						binary: {
							data: {
								data: Buffer.from(pdfBuffer).toString('base64'),
								mimeType: 'application/pdf',
								fileName: fileName,
							},
						},
					});
				}

			} catch (error: any) {
				if (browser) {
					await browser.close();
					browser = undefined;
				}

				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
					});
					continue;
				}
				throw error;
			}
		}

		// Fechar browser se ainda estiver aberto
		if (browser) {
			await browser.close();
		}

		return [returnData];
	}
} 