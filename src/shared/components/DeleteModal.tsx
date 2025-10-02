export type DeleteModalProps = {
    title: string;
    onCancel?: () => void;
    onAccept?: () => void;
}
export default function DeleteModal({ title, onCancel, onAccept }: DeleteModalProps) {
    return <div className="w-60">
        <p className="text-sm">{title}</p>
        <div className="flex justify-end gap-2">
            <button type="button" className="px-3 py-2 rounded-md" onClick={() => onCancel?.()}>Cancel</button>
            <button type="button" className="bg-amber-600 hover:bg-amber-700 px-3 py-2 rounded-md" onClick={() => onAccept?.()}>Delete</button>
        </div>
    </div>
}