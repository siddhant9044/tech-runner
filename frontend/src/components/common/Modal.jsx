export default function Modal({children,onClose}){return <div className="game-modal"><div className="modal-card">{children}{onClose&&<button onClick={onClose}>CLOSE</button>}</div></div>}
