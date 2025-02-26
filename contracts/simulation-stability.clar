;; Simulation Stability Monitoring Contract

(define-map stability-reports
  { simulation-id: uint }
  {
    last-check: uint,
    stability-score: uint,
    issues: (list 5 (string-ascii 64))
  }
)

(define-public (report-stability (simulation-id uint) (stability-score uint) (issues (list 5 (string-ascii 64))))
  (ok (map-set stability-reports
    { simulation-id: simulation-id }
    {
      last-check: block-height,
      stability-score: stability-score,
      issues: issues
    }
  ))
)

(define-read-only (get-stability-report (simulation-id uint))
  (map-get? stability-reports { simulation-id: simulation-id })
)

(define-read-only (is-simulation-stable (simulation-id uint))
  (match (map-get? stability-reports { simulation-id: simulation-id })
    report (>= (get stability-score report) u80)
    false
  )
)

