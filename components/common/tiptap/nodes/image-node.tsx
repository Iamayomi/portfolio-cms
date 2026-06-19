"use client";

import TiptapImage from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import type { DOMOutputSpec } from "@tiptap/pm/model";

import "./image-node.scss";

type CaptionedImageAttrs = {
  src?: string | null;
  alt?: string | null;
  title?: string | null;
  width?: number | null;
  height?: number | null;
  caption?: string | null;
};

function getImageAttrsFromFigure(element: HTMLElement): CaptionedImageAttrs {
  const img = element.querySelector("img");
  const figcaption = element.querySelector("figcaption");

  return {
    src: img?.getAttribute("src"),
    alt: img?.getAttribute("alt"),
    title: img?.getAttribute("title"),
    width: img?.hasAttribute("width")
      ? Number(img.getAttribute("width"))
      : null,
    height: img?.hasAttribute("height")
      ? Number(img.getAttribute("height"))
      : null,
    caption: figcaption?.textContent?.trim() || null,
  };
}

function splitCaptionFromAttrs(attrs: Record<string, unknown>) {
  const { caption, ...imageAttrs } = attrs;
  return {
    caption: typeof caption === "string" ? caption.trim() : "",
    imageAttrs,
  };
}

function CaptionedImageNodeView({ node, updateAttributes }: NodeViewProps) {
  const attrs = node.attrs as CaptionedImageAttrs;

  return (
    <NodeViewWrapper className="tiptap-image-figure" as="figure">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={attrs.src || ""}
        alt={attrs.alt || ""}
        title={attrs.title || undefined}
        width={attrs.width || undefined}
        height={attrs.height || undefined}
        draggable={false}
      />
      <textarea
        aria-label="Image caption"
        className="tiptap-image-caption"
        contentEditable={false}
        placeholder="Add image caption"
        rows={1}
        value={attrs.caption || ""}
        onChange={(event) =>
          updateAttributes({ caption: event.currentTarget.value })
        }
      />
    </NodeViewWrapper>
  );
}

const ImageNode = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-caption"),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="image"]',
        getAttrs: (element) => getImageAttrsFromFigure(element as HTMLElement),
      },
      {
        tag: this.options.allowBase64
          ? "img[src]"
          : 'img[src]:not([src^="data:"])',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, imageAttrs } = splitCaptionFromAttrs(HTMLAttributes);
    const img: DOMOutputSpec = [
      "img",
      mergeAttributes(this.options.HTMLAttributes, imageAttrs),
    ];

    if (!caption) {
      return img;
    }

    return [
      "figure",
      { "data-type": "image", class: "tiptap-image-figure" },
      img,
      ["figcaption", { class: "tiptap-image-caption" }, caption],
    ] satisfies DOMOutputSpec;
  },

  addNodeView() {
    return ReactNodeViewRenderer(CaptionedImageNodeView);
  },
});

export default ImageNode;
