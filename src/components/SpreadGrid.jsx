import { StateProvider } from "../contexts/StateContext";
import Grid from "../fragments/Grid";

export default function SpreadGrid(props) {
    return (
        <StateProvider {...props}>
            <Grid />
        </StateProvider>
    );
}