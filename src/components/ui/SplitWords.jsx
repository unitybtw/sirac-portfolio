import { Fragment } from 'react';

// Wraps each word in a clipping mask so headings can rise into place word by word.
// Real spaces stay between the masks, so wrapping, copy/paste and screen readers
// behave exactly like plain text. Without an active animation it renders static.
export default function SplitWords({ text, className = '' }) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  return (
    <span className={`pm-words ${className}`.trim()}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 && ' '}
          <span className="pm-w" style={{ '--i': index }}>
            <span>{word}</span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}
