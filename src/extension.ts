import * as vscode from 'vscode'
import { jumpPointDecorator } from './decorator'

const colShadowRange = (line: number, char: number) =>
  new vscode.Range(line, char, line, char + 1)

function setupCommands(_context: vscode.ExtensionContext) {
  //
}

export function activate(context: vscode.ExtensionContext) {
  let activeEditor = vscode.window.activeTextEditor

  setupCommands(context)

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor
      if (editor) {
        triggerUpdateDecorations()
      }
    },
    null,
    context.subscriptions
  )

  vscode.window.onDidChangeTextEditorSelection(
    triggerUpdateDecorations,
    null,
    context.subscriptions
  )

  function updateDecorations() {
    if (!activeEditor) return

    const DISTNACE =
      vscode.workspace.getConfiguration('maaiCursor').get<number>('distance') ||
      5

    const { character, line } = activeEditor.selection.anchor
    const firstLine = 0
    const lastLine = activeEditor.document.lineCount - 1
    const notCurrentLine = (v: number) => v !== line
    const upLine = Math.max(firstLine, line - DISTNACE)
    const dwLine = Math.min(lastLine, line + DISTNACE)
    const jetLines = [upLine, dwLine]

    const jumpPoints: vscode.DecorationOptions[] = jetLines
      .filter(notCurrentLine)
      .map((line) => ({ range: colShadowRange(line, character) }))

    if (jumpPoints.length > 0) {
      activeEditor.setDecorations(jumpPointDecorator, jumpPoints)
    }
  }
  function triggerUpdateDecorations() {
    updateDecorations()
  }
}

export function deactivate() {
  jumpPointDecorator.dispose()
}
