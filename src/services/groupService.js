import { collection, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { fileService } from "./fileService";
import supabase from "../lib/supabase";

export class groupService {
    static async changeGroupName(chatId, newName) {
        
    }

    static async changeGroupAvatar(chatId, newAvatar) {

    }

    static async kickGroupUser(chatId, user) {

    }

    static async addGroupUser(chatId, user) {

    }
}