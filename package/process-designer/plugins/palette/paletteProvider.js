
/**
 * A palette provider for BPMN 2.0 elements.
 */
export default function PaletteProvider (
    paletteEntries,
    customPalette,
    spaceTool
) {
 console.log(paletteEntries)
    this._entries = paletteEntries
    customPalette.registerProvider(this)
}

PaletteProvider.$inject = [
    'config.paletteEntries',
    'customPalette',
    'spaceTool'
]

PaletteProvider.prototype.getPaletteEntries = function (element) {
  debugger
    return this._entries
}
