;; Simulation Creation Contract

(define-map simulations
  { id: uint }
  {
    creator: principal,
    name: (string-ascii 64),
    description: (string-utf8 256),
    physics-hash: (buff 32)
  }
)

(define-data-var next-simulation-id uint u0)

(define-public (create-simulation (name (string-ascii 64)) (description (string-utf8 256)) (physics-hash (buff 32)))
  (let
    ((simulation-id (var-get next-simulation-id)))
    (var-set next-simulation-id (+ simulation-id u1))
    (ok (map-set simulations
      { id: simulation-id }
      {
        creator: tx-sender,
        name: name,
        description: description,
        physics-hash: physics-hash
      }
    ))
  )
)

(define-read-only (get-simulation (simulation-id uint))
  (map-get? simulations { id: simulation-id })
)

