# GCP Monthly Cost Estimation (Migration Target)

This estimate covers the monthly operational costs for the Receptor ecosystem following the migration to GCP (Melbourne/Sydney).

## 1. Google Cloud App Hub Cost
> [!NOTE]
> **App Hub Pricing:** $0.00 / month
> App Hub is a management tool provided at no additional charge. However, it organizes resources that carry their own costs (Cloud Run, Load Balancing, etc.).

---

## 2. Service-by-Service Projections (Melbourne/Sydney)

Estimates assume **Tier 1** regional pricing for `australia-southeast1` (Sydney) and `australia-southeast2` (Melbourne).

### 2.1 Compute: Cloud Run
*Billed only during request execution.*
- **Requests:** First 2M requests/month are **Free**.
- **CPU/RAM:** ~$0.00003 - $0.00004 per second.
- **Projected (5 Services, Low Usage):** **~$10.00 / month**
- **Projected (5 Services, Continuous Dev):** **~$25.00 / month**

### 2.2 Storage: Artifact Registry
- **Storage:** $0.10 per GiB/month.
- **Estimated Usage (20GB across images/stages):** **~$2.00 / month**

### 2.3 Security: Secret Manager
- **Active Secret Versions:** $0.06 per version/month.
- **Projected (30 Secrets @ 1 version each):** **~$1.80 / month**
- **Access Operations:** First 10,000 are **Free**.

### 2.4 Networking: Connectivity
- **Direct Cloud Run URLs:** $0.00 / month.
- **Cloud Load Balancer (Global/External):** ~$18.00 base + ~$0.008 per GB processed.
- **Static IPs:** ~$0.01 per hour ($7.20/month) if not attached to a running resource.

---

## 3. Total Monthly Estimates

| Scenarios | Estimated Cost (Monthly) | Best For |
| :--- | :--- | :--- |
| **Minimalist (Direct URL)** | **~$15.00 - $20.00** | Initial migration & Dev/Staging. |
| **Standard (App Hub + LB)** | **~$35.00 - $55.00** | Production with custom domains and WAF. |
| **Enterprise (HA + Peak)** | **~$80.00+** | High-traffic periods with multi-region failover. |

---

## 4. Cost Optimization Strategy
1. **Scale-to-Zero:** Ensure all Cloud Run services are configured with `min-instances: 0` for non-critical environments.
2. **Lifecycle Policies:** Configure Artifact Registry to auto-delete images older than 30 days or limited to the last 5 versions.
3. **Commitment Discounts:** (Not recommended until traffic stabilizes) 17% - 46% savings for committed usage.

> [!IMPORTANT]
> **Comparison vs Self-Hosted:** While cloud-native services have a "line-item" cost, they eliminate the **operational cost of hardware maintenance** and **electricity/cooling**, which typically exceeds $150/month for the existing Hyper-V physical stack.
