// import {Request, Response} from "express";
// import {imageDB} from "../../../../schema/imageDB.js";
//
// export const getImage = async (req: Request, res: Response): Promise<void> => {
//   const uuid = req.params.uuid;
//
//   try {
//     const image = await imageDB.findOne({ UUID: uuid });
//
//     const base64Image = image?.ImageBase64;
//
//     const [mimeType, base64Data] = base64Image?.split(",") ?? [];
//     const fileType = mimeType.split(":")[1].split(";")[0];
//
//     const buffer = Buffer.from(base64Data, "base64");
//
//     res.setHeader("Content-Type", fileType);
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="image.${fileType.split("/")[1]}"`
//     );
//
//     res.status(200).send(buffer);
//   } catch (error) {
//     console.error("Error processing image:", error);
//     res.status(500).send("Failed to process image");
//   }
// };
