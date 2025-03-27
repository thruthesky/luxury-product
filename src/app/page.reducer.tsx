export interface Product {
  name: string;
  brand: string;
  price: number;
  currency: string;
  company: string;
  year: number;
  size: string;
  material: string;
  description: string;
  website: string;
}

export interface State {
  progress: number;
  product: Product | null;
  imageUrl: string | null;
  loading: boolean;
}

export const initialState: State = {
  progress: 0,
  product: null,
  imageUrl: null,
  loading: false,
};

export function reducer(
  state: State,
  action: {
    type: string;
    // eslint-disable-next-line
    [key: string]: any;
  }
) {
  switch (action.type) {
    case "setProduct":
      return {
        ...state,
        product: { ...state.product, ...action.product },
        loading: false,
      };
    case "resetProduct":
      return { ...state, product: null };
    case "setImageUrl":
      return { ...state, imageUrl: action.imageUrl, progress: 0 };
    case "removeImageUrl":
      return { ...state, imageUrl: null };
    case "setProgress":
      return { ...state, progress: action.progress };
    case "loadingOn":
      return { ...state, loading: true };
    case "loadingOff":
      return { ...state, loading: false };
    default:
      return state;
  }
}

export function setProduct(product: Partial<Product>) {
  return { type: "setProduct", product };
}
export function resetProduct() {
  return { type: "resetProduct" };
}
export function setImageUrl(imageUrl: string) {
  return { type: "setImageUrl", imageUrl, product: null };
}
export function removeImageUrl() {
  return { type: "removeImageUrl" };
}

export function setProgress(progress: number) {
  return { type: "setProgress", progress };
}

export function loadingOn() {
  return { type: "loadingOn" };
}
export function loadingOff() {
  return { type: "loadingOff" };
}
