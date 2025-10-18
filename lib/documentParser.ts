import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseDocument(
  file: File
): Promise<{ text: string; fileName: string }> {
  const fileName = file.name;
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  if (!fileExtension || !['pdf', 'docx'].includes(fileExtension)) {
    throw new Error('Only PDF and DOCX files are supported');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (fileExtension === 'pdf') {
    const data = await pdfParse(buffer);
    return { text: data.text, fileName };
  } else if (fileExtension === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value, fileName };
  }

  throw new Error('Unsupported file type');
}

export async function parseDocumentFromBuffer(
  buffer: Buffer,
  fileName: string
): Promise<{ text: string; fileName: string }> {
  const fileExtension = fileName.split('.').pop()?.toLowerCase();

  if (!fileExtension || !['pdf', 'docx'].includes(fileExtension)) {
    throw new Error('Only PDF and DOCX files are supported');
  }

  if (fileExtension === 'pdf') {
    const data = await pdfParse(buffer);
    return { text: data.text, fileName };
  } else if (fileExtension === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value, fileName };
  }

  throw new Error('Unsupported file type');
}

