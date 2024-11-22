import supabase from '../lib/supabase'

export class imageService {
    static async uploadImageAndGetLink(img, str) {
        try {
            if (!img) return;

            console.log(img.file)

            const { data, error } = await supabase.storage.from(str).upload(`uploads/${img.file.name}`, img.file);
            
            console.log('Uploaded image', data)

            const { data: publicUrl, error: urlError } = supabase.storage.from(str).getPublicUrl(`uploads/${img.file.name}`);

            return publicUrl.publicUrl;
        } catch (error) {
            console.log(error)
        }
    }
}