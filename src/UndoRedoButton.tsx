import { CgRedo, CgUndo } from 'solid-icons/cg'
import { canRedo, canUndo, redo, undo } from './Logic'

const UndoButton = () => {
  return (
    <div class='flex items-center space-x-1'>
      <button
        class='flex size-10 items-center justify-center rounded-full bg-gradient-to-b from-neutral-700 to-black active:from-black active:to-neutral-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500'
        disabled={!canUndo()}
        onClick={undo}
      >
        <CgUndo size={24} />
      </button>
      <span>undo</span>
    </div>
  )
}

const RedoButton = () => {
  return (
    <div class='flex items-center space-x-1'>
      <span>redo</span>
      <button
        class='flex size-10 items-center justify-center rounded-full bg-gradient-to-b from-neutral-700 to-black active:from-black active:to-neutral-700 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500'
        disabled={!canRedo()}
        onClick={redo}
      >
        <CgRedo size={24} />
      </button>
    </div>
  )
}

const UndoRedoButton = () => {
  return (
    <div class='flex justify-between p-1'>
      <UndoButton />
      <RedoButton />
    </div>
  )
}

export default UndoRedoButton
