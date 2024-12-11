import supabase from '../lib/supabase'

export class fileService {
    static async uploadFileAndGetLink(file, dest) {
        try {
            if (!file) return;

            console.log(file)

            const { data, error } = await supabase.storage.from(dest).upload(`uploads/${file.name}`, file);

            console.log('Uploaded image or file', data)

            const { data: publicUrl, error: urlError } = supabase.storage.from(dest).getPublicUrl(`uploads/${file.name}`);

            if (dest == 'files') {
                return { name: data.path.split('/')[1], url: publicUrl.publicUrl };
                // return { name: data.path.split('/')[1], url: publicUrl.publicUrl };
            }
            return publicUrl.publicUrl;
        } catch (error) {
            console.log(error)
        }
    }

    static async getDownloadLink(dest, file) {
        try {
            const { data, error } = await supabase.storage.from(dest).download(`uploads/${file.name}`);
            const url = URL.createObjectURL(data);
            // console.log(data)
            return url;
        } catch (error) {
            console.log(error)
        }
    }
}