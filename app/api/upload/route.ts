import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary environment variables are not set" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const timestamp = Math.round(new Date().getTime() / 1000).toString();
    const folder = "ai-brief-generator";
    
    // Sort parameters alphabetically
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
    const stringToSign = `${paramsToSign}${apiSecret}`;
    
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("timestamp", timestamp);
    uploadFormData.append("signature", signature);
    uploadFormData.append("folder", folder);

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    if (!cloudinaryRes.ok) {
      const errorText = await cloudinaryRes.text();
      throw new Error(`Cloudinary upload failed: ${errorText}`);
    }

    const data = await cloudinaryRes.json();
    return NextResponse.json({ secure_url: data.secure_url });
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
