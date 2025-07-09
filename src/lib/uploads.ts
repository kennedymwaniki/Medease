import { toast } from 'sonner'
import supabase from '@/apis/supabase'

async function uploadFile(file: any) {
  const { data, error } = await supabase.storage
    .from('bucket_name')
    .upload(`images/${file.name}`, file)
  if (error) {
    console.error('Error uploading file:', error)
    toast.error(`Error uploading file: ${error.message}`, {
      position: 'top-right',
    })
    return null
  } else {
    toast.success('File uploaded successfully:', data)
    return data
  }
}
export default uploadFile
