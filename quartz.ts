import type { Element, Root } from "hast"
import { visit } from "unist-util-visit"
import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import type { QuartzTransformerPlugin } from "./quartz/plugins/types"

const LocalizeFootnotes: QuartzTransformerPlugin = () => ({
  name: "LocalizeFootnotes",
  htmlPlugins() {
    return [
      () => (tree: Root) => {
        visit(tree, "element", (node: Element) => {
          if (node.properties?.id === "footnote-label") {
            node.children = [{ type: "text", value: "脚注" }]
          }

          if (node.properties && "dataFootnoteBackref" in node.properties) {
            const ariaLabel = node.properties.ariaLabel
            if (typeof ariaLabel === "string") {
              const match = ariaLabel.match(/^Back to reference (.+)$/)
              if (match) {
                node.properties.ariaLabel = `返回引用 ${match[1]}`
              }
            }
          }
        })
      },
    ]
  },
})

const config = await loadQuartzConfig()
config.plugins.transformers.push(LocalizeFootnotes())
export default config
export const layout = await loadQuartzLayout()
