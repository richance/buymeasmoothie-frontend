const copyToClipboard = (content: string): void => {
    const textArea = document.createElement('textarea');

    textArea.value = content;

    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.execCommand('copy');

    document.body.removeChild(textArea);
}

export default copyToClipboard;
