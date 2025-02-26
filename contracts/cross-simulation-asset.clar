;; Cross-simulation Asset Transfer Contract

(define-map assets
  { asset-id: uint }
  {
    owner: principal,
    name: (string-ascii 64),
    current-simulation: uint
  }
)

(define-data-var next-asset-id uint u0)

(define-public (create-asset (name (string-ascii 64)) (simulation-id uint))
  (let
    ((asset-id (var-get next-asset-id)))
    (var-set next-asset-id (+ asset-id u1))
    (ok (map-set assets
      { asset-id: asset-id }
      {
        owner: tx-sender,
        name: name,
        current-simulation: simulation-id
      }
    ))
  )
)

(define-public (transfer-asset (asset-id uint) (to-simulation uint))
  (match (map-get? assets { asset-id: asset-id })
    asset (begin
      (asserts! (is-eq tx-sender (get owner asset)) (err u403))
      (ok (map-set assets
        { asset-id: asset-id }
        (merge asset { current-simulation: to-simulation })
      )))
    (err u404)
  )
)

(define-read-only (get-asset (asset-id uint))
  (map-get? assets { asset-id: asset-id })
)

