import { Snippet } from "../stores/data-store";
import Tag from "./tag";

interface SnippetCardProps {
    snippet: { name: string } & Snippet;
    onClick: () => void;
}

const SnippetCard = ({ snippet, onClick }: SnippetCardProps) => {
    return (
        <div className="card bg-base-300 cursor-pointer" onClick={onClick}>
            <div className="card-body p-4">
                <div className="card-title">{snippet.name}</div>
                <div className="divider my-2" />
                <div className="card-actions justify-end">
                    {snippet.tags.map((tag) => (
                        <Tag key={tag} name={tag} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SnippetCard;
