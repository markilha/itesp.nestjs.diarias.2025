import { extname } from 'path';

export const generateUniqueFileName = (originalName: string, SQE_ID_CODIGO: number): string => {
  // Extrai a extensão do arquivo
  const fileExtension = extname(originalName);

  const now = new Date();
  const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now
    .getHours()
    .toString()
    .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;

  // Sanitiza o nome original para evitar caracteres problemáticos
  const sanitizedOriginalName = originalName
    .replace(/[^a-zA-Z0-9]/g, '_') // Substitui caracteres especiais por "_"
    .substring(0, 20); // Limita o nome original a 20 caracteres (opcional)

  // Gera o nome único do arquivo
  return `${SQE_ID_CODIGO}_${timestamp}${fileExtension}`;
};
