export const SuccessModal = (props) => {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => props.setSuccess(prevSucc => !prevSucc)}></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title has-text-centered">Ok</p>
          <button className="delete" aria-label="close" onClick={() => props.setSuccess(prevSucc => !prevSucc)}></button>
        </header>
        <section className="modal-card-body">
          <p>Creation Succedeed</p>
        </section>

      </div>
    </div>
  )
}