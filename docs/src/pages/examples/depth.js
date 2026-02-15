import Example from "../../components/Example";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import { default as App } from "./apps/depth";


export default function Depth() {
    return (
        <>
            <Example>
                <App />
            </Example>
            <Paragraph>
                Code of this example can be found on <a href="https://github.com/TomaszRewak/js-spread-grid/blob/master/docs/src/pages/examples/apps/depth.js">GitHub</a>.
            </Paragraph>
            <Section>
                <Paragraph>
                    An order book is a real-time list of buy and sell orders for a financial instrument, organized by price level. Bids (buy orders) are stacked below the mid-price, asks (sell orders) above it. Each level shows the total size available at that price. This example simulates a live order book with market activity that continuously updates.
                </Paragraph>
                <Paragraph>
                    The grid demonstrates a semi-infinite layout populated by very sparse data, with interruptable smooth scrolling and non-linear row indexing (tick sizes grow as prices move away from the mid-price).
                </Paragraph>
                <Paragraph>
                    <ul>
                        <li>The book auto-scrolls smoothly, but you can scroll manually at any time - hovering the grid pauses the auto-scroll</li>
                        <li>Click on <strong>mb</strong>/<strong>ma</strong> (market bid/ask) columns to place orders at the respective price level - either joining the resting book or taking liquidity</li>
                        <li>Click on <strong>ob</strong>/<strong>oa</strong> (our bid/ask) columns to cancel your resting orders at that level</li>
                        <li>You can scroll deep into the book and still place orders at distant price levels</li>
                        <li>A small indicator on the side flashes when one of your orders has traded</li>
                        <li>Your orders are included in the displayed market order sizes</li>
                    </ul>
                </Paragraph>
            </Section>
        </>
    )
}