import { deleteObject, getDownloadURL, getMetadata, ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import { ChangeEvent } from "react";
import { storage } from "./clientApp";

export function uploadImage(event: ChangeEvent<HTMLInputElement>, {
    onUpload,
    progress,
    deleteUrl,
}: {
    onUpload: (url: string) => void;
    progress?: (progress: number) => void;
    deleteUrl?: string;
}) {

    const files = event.target.files;
    if (!files || files.length == 0) return;
    const uploadRef = ref(
        storage,
        `tmp/${files[0].name}`
    );
    const uploadTask = uploadBytesResumable(uploadRef, files[0]);
    uploadTask.on(
        "state_changed",
        (snapshot: UploadTaskSnapshot) => {
            const percent =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${percent}% done`);
            if (progress) progress(percent);

            switch (snapshot.state) {
                case "paused":
                    console.log("Upload is paused");
                    break;
                case "running":
                    console.log("Upload is running");
                    break;
            }
        },
        (error) => {
            console.error(error);
        },
        () => {
            console.log("Upload complete");
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
                console.log("File available at", downloadURL);

                if (deleteUrl) {
                    console.log("Delete  url", deleteUrl);

                    deleteObject(ref(storage, deleteUrl))
                        .then(() => {
                            console.log("File deleted successfully");
                        })
                        .catch((error: unknown) => {
                            console.log("Uh-oh, an error occurred!", error);
                        });
                }
                onUpload(downloadURL);

                event.target.value = "" // Clear the input value to allow re-uploading the same file;
            });
        }
    );
}


export function deleteImage(url: string, { onSuccess, onError }: {
    onSuccess?: (url: string) => void;
    onError?: (url: string) => void;
} = {}) {
    deleteObject(ref(storage, url))
        .then(() => {
            console.log("File deleted successfully");
            if (onSuccess) onSuccess(url);
        })
        .catch((error: unknown) => {
            console.log("Uh-oh, an error occurred!", error);
            if (onError) onError(url);
        });
}



export async function getMimeType(fileUrl: string): Promise<string | null> {
    try {
        // Create a reference to the file
        const fileRef = ref(storage, fileUrl);

        // Get the metadata of the file
        const metadata = await getMetadata(fileRef);

        // Return the contentType (MIME type)
        return metadata.contentType || null;
    } catch (error) {
        console.error("Error fetching metadata:", error);
        return null;
    }
}
