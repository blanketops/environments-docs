                Kubernetes API
                     │
                     │  Build CR Created/Updated
                     ▼
            +----------------------+
            |   Build Controller   |
            |  (BuildReconciler)   |
            +----------+-----------+
                       │
                       │ Command
                       ▼
               +---------------+
               | Runtime Engine|
               +-------+-------+
                       │
                       ▼
               +---------------+
               |  Build Domain |
               +-------+-------+
                       │
        ┌──────────────┼──────────────┐
        │                              │
        ▼                              ▼
 +-------------+              +----------------+
 |  Mediator   |              |  Build Service |
 +------+------+              +--------+-------+
        │                              │
        │ Infrastructure               │ Strategy Selection
        ▼                              ▼
 ExternalSecret                BackendSelector
 ServiceAccount                       │
 Registry Creds                       ▼
                                     
                              +---------------+
                              | KanikoProvider|
                              +-------+-------+
                                      │
                                      ▼
                            Shipwright BuildRun
