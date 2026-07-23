export default function LoadingSpinner({ size = 48, text = 'Loading...' }) {
  return (
    <div className="spinner-wrap" role="status" aria-label={text}>
      <div
        className="spinner"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {text && <p className="spinner-text">{text}</p>}

      <style>{`
        .spinner-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 48px;
        }
        .spinner {
          border: 3px solid var(--clr-light-gray);
          border-top-color: var(--clr-gold);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spinner-text {
          font-size: 0.875rem;
          color: var(--clr-mid-gray);
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
