import { fileService } from "../services/fileService";

export const handleDownloadImage = async (img) => {
    try {
        const imgName = img.split('/').at(-1);

        const imgLink = await fileService.getDownloadLink('avatars', { name: imgName })

        return imgLink;
    } catch (error) {
        console.error("Ошибка при скачивании файла:", error);
    }
}