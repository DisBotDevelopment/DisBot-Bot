export interface DrawCardOptions {
    theme: "dark" | "circuit" | "code";
    text: {
        title: string;
        subtitle: string;
        text: string;
        color: string;
    };
    avatar: {
        image: string;
        outlineWidth: number;
        outlineColor: string;
    };
    card: {
        background: string;
        blur: number;
        border: boolean;
        rounded: boolean;
    };
}