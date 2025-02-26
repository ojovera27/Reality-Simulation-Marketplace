;; Experience Licensing Contract

(define-map licenses
  { license-id: uint }
  {
    simulation-id: uint,
    licensee: principal,
    expiration: uint
  }
)

(define-data-var next-license-id uint u0)

(define-public (issue-license (simulation-id uint) (licensee principal) (duration uint))
  (let
    ((license-id (var-get next-license-id)))
    (var-set next-license-id (+ license-id u1))
    (ok (map-set licenses
      { license-id: license-id }
      {
        simulation-id: simulation-id,
        licensee: licensee,
        expiration: (+ block-height duration)
      }
    ))
  )
)

(define-read-only (check-license (license-id uint))
  (match (map-get? licenses { license-id: license-id })
    license (< block-height (get expiration license))
    false
  )
)

