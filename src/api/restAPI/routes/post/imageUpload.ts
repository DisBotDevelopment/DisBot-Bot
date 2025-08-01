// import {Request, Response} from "express";
// import pkg from "short-uuid";
// const { uuid } = pkg;
// import {imageDB} from "../../../../schema/imageDB.js";
//
// export const imageUpload = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const image = req.file;
//
//     if (!image) {
//       res.status(400).json({ error: "Image not provided" });
//       return;
//     }
//
//     const base64 = image.buffer.toString("base64");
//
//     const uuids = uuid();
//
//     await imageDB.create({
//       ImageBase64: `data:${image.mimetype};base64,${base64}`,
//       URL: "https://api.disbot.app/v2/image/" + uuids,
//       UUID: uuids,
//     });
//
//     res.json({ url: "https://api.disbot.app/v2/image/" + uuids });
//   } catch (e) {
//     console.log(e);
//
//     res.status(500).json({ error: "Internal Server Error", message: e });
//   }
// };
//
// export default imageUpload;
