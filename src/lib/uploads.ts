import { toast } from 'sonner'
import supabase from '@/apis/supabase'

function generateRandomImageName(originalFileName?: string): string {
  // Generate two random letters (A-Z)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const randomLetter1 = letters[Math.floor(Math.random() * letters.length)]
  const randomLetter2 = letters[Math.floor(Math.random() * letters.length)]

  // Generate a random number (1000-9999 for 4 digits)
  const randomNumber = Math.floor(Math.random() * 9000) + 1000

  // Get file extension from original filename if provided
  const fileExtension = originalFileName
    ? originalFileName.split('.').pop()
    : 'jpg'

  return `${randomLetter1}${randomLetter2}${randomNumber}.${fileExtension}`
}

async function uploadFile(file: any) {
  const imageUrl =
    'https://dlskybcztupsdcovqpma.supabase.co/storage/v1/object/public/medease/'
  const randomFileName = generateRandomImageName(file.name)
  const { data, error } = await supabase.storage
    .from('medease')
    .upload(`images/${randomFileName}`, file)
  if (error) {
    console.error('Error uploading file:', error)
    toast.error(`Error uploading file: ${error.message}`, {
      position: 'top-right',
    })
    return null
  } else {
    console.log('File uploaded successfully', data.fullPath)
    toast.success(`File uploaded successfully: ${data.fullPath}`, {
      position: 'top-right',
    })
    console.log('This is the response from supabase upload:', data)
    console.log('This is the image URL:', imageUrl + data.path)
    return data
  }
}
export { generateRandomImageName }
export default uploadFile
