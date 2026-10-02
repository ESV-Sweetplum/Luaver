export default function getPriorityScore(path: string): number {
    let score = 0;
    if (path.includes('.priority.')) score++;
    if (path.includes('.finality.')) score--;

    return score;
}
