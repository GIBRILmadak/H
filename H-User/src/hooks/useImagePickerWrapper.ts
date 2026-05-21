import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const useImagePickerWrapper = () => {
    const pickImage = async () => {
        if (Platform.OS === "web") {
            return new Promise((resolve) => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";

                input.onchange = (e: any) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                        resolve({ canceled: true });
                        return;
                    }

                    const reader = new FileReader();
                    reader.onload = (event: any) => {
                        const base64 = event.target.result.split(",")[1];
                        resolve({
                            canceled: false,
                            assets: [
                                {
                                    uri: event.target.result,
                                    base64: base64,
                                    width: 0,
                                    height: 0,
                                    type: "image",
                                },
                            ],
                        });
                    };
                    reader.readAsDataURL(file);
                };

                input.click();
            });
        }

        // Pour React Native/Expo
        return ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });
    };

    const takePhoto = async () => {
        if (Platform.OS === "web") {
            // Web n'a pas accès à la caméra via ce hook, retourner une erreur
            throw new Error(
                "Camera not available on web. Use pickImage instead.",
            );
        }

        return ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
            base64: true,
        });
    };

    return { pickImage, takePhoto };
};
