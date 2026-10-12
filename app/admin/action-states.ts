import type { ProductFormState } from "@/app/admin/product-actions";
import type { PostFormState, UploadState } from "@/app/admin/post-actions";

export const IDLE_PRODUCT_STATE: ProductFormState = { status: "idle" };

export const IDLE_POST_STATE: PostFormState = { status: "idle" };

export const UPLOAD_IDLE_STATE: UploadState = { status: "idle" };
