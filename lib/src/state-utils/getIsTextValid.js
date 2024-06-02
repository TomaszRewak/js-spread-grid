export default function getIsTextValid(text, editableCells) {
    return editableCells.every(cell => cell.edit.validate({ string: text }));
}
