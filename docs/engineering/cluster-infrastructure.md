# Receptor Cluster Infrastructure

Physical hosts, virtual machines, and k3s cluster topology for the Receptor
on-premises infrastructure.

---

## Physical Hosts

The Receptor cluster runs across two physical Windows 11 machines acting as
Hyper-V hypervisors on a shared VLAN 10 network (`10.10.0.0/24`).

### HYPERV-1 — SPACESHIP

The original cluster host. Runs control-plane node ctrl-50 and two workers.

| Component | Detail |
|---|---|
| **Motherboard** | *(not recorded — see HWiNFO on host)* |
| **OS** | Windows 11 Pro, Hyper-V enabled |
| **Role** | Primary hypervisor — ctrl-50, work-01, work-02 |

**Virtual Machines**

| VM Name | State | vCPU | RAM | VLAN 10 IP | Role |
|---|---|---|---|---|---|
| `receptor-ctrl-50` | Running | 2 | 8 GB | 10.10.0.50 | k3s control-plane + etcd |
| `receptor-work-01` | Running | 4 | 4 GB | 10.10.0.21 | k3s worker |
| `receptor-work-02` | Running | 2 | 4 GB | 10.10.0.22 | k3s worker |
| `common-bond` | Off | — | — | — | Reserved |
| `Florence` | Off | — | — | — | Reserved |
| `VOYAGER` | Off | — | — | Reserved (Gen 1) |

---

### HYPERV-2 — ENTERPRISE (added 2026-03-16)

Second physical host added 2026-03-16. Runs two HA control-plane peers and a
high-capacity worker, offloading CPU-intensive workloads from HYPERV-1.

| Component | Detail |
|---|---|
| **Motherboard** | GIGABYTE B550M DS3H AC (AMD B550, Promontory PRO19 C/C1) |
| **BIOS** | F20d (09/02/2024), UEFI |
| **CPU** | AMD (AM4 socket, 7nm, 6 cores / 12 threads) |
| **CPU clocks** | Base 3700 MHz, Boost max 4650 MHz, PBO max 4650 MHz |
| **RAM** | 32 GB DDR4 Dual-Channel |
| **RAM modules** | 2× G.Skill F4-3600C18-8GVK (PC4-28800, DDR4-3600 UDIMM) |
| **RAM timings** | CL18-22-22-42 @ XMP 1.35V |
| **GPU** | GIGABYTE GeForce RTX 3060 Ti WINDFORCE OC 8G (8 GB GDDR6) |
| **Storage** | Samsung MZVL21T0HCLR (1 TB NVMe, PCIe 4.0 ×4) |
| **OS** | Windows 11 Professional (Build 22631.6199 23H2) |
| **Security** | UEFI Boot, Secure Boot, TPM, HVCI enabled |

**Virtual Machines**

| VM Name | State | vCPU | RAM | VLAN 10 IP | Role |
|---|---|---|---|---|---|
| `receptor-ctrl-10` | Running | 6 | 8 GB | 10.10.0.10 | k3s control-plane + etcd |
| `receptor-ctrl-11` | Running | 6 | 8 GB | 10.10.0.30 | k3s control-plane + etcd |
| `receptor-work-10` | Running | 6 | 8 GB | 10.10.0.20 | k3s worker |

---

## Network Topology

All VMs have two network interfaces:

| NIC | Hyper-V switch | Config | Purpose |
|---|---|---|---|
| `eth0` | External (untagged) | DHCP from router | Internet egress, management SSH |
| `eth1` | VLAN 10 | Static `10.10.0.x/24`, no gateway | k3s cluster-internal traffic |

> [!NOTE]
> Hyper-V strips the VLAN 10 tag before the VM sees it. No `vlan` package is
> needed inside VMs — `eth1` is configured as a plain NIC with a static IP.

### IP Plan

| IP | Hostname | Role | Host |
|---|---|---|---|
| 10.10.0.10 | receptor-ctrl-10 | control-plane + etcd | ENTERPRISE |
| 10.10.0.20 | receptor-work-10 | worker | ENTERPRISE |
| 10.10.0.21 | receptor-work-01 | worker | SPACESHIP |
| 10.10.0.22 | receptor-work-02 | worker | SPACESHIP |
| 10.10.0.23 | receptor-work-03 | *(reserved)* | — |
| 10.10.0.30 | receptor-ctrl-11 | control-plane + etcd | ENTERPRISE |
| 10.10.0.50 | receptor-ctrl-50 | control-plane + etcd | SPACESHIP |

---

## k3s Cluster

**Version:** k3s v1.34.5+k3s1  
**CNI:** Calico (tigera-operator), flannel backend disabled  
**Container runtime:** containerd 2.1.5-k3s1

### Nodes

| Node | Role | IP | vCPU | RAM (allocatable) | Kernel |
|---|---|---|---|---|---|
| receptor-ctrl-10 | control-plane, etcd | 10.10.0.10 | 6 | ~7.8 GB | 6.17.0-1008-azure |
| receptor-ctrl-11 | control-plane, etcd | 10.10.0.30 | 6 | ~7.8 GB | 6.17.0-1008-azure |
| receptor-ctrl-50 | control-plane, etcd | 10.10.0.50 | 2 | ~7.8 GB | 6.17.0-1008-azure |
| receptor-work-01 | worker | 10.10.0.21 | 4 | ~3.9 GB | 6.17.0-1008-azure |
| receptor-work-02 | worker | 10.10.0.22 | 2 | ~3.9 GB | 6.17.0-1008-azure |
| receptor-work-10 | worker | 10.10.0.20 | 6 | ~7.8 GB | 6.17.0-1008-azure |

**Total cluster capacity:** 26 vCPU, ~39 GB RAM (workers only: 12 vCPU, ~11.7 GB)

> [!NOTE]
> All nodes run `linux-azure` (the Hyper-V optimised kernel). This provides
> synthetic NIC drivers, dynamic memory ballooning, and improved I/O throughput
> compared to the generic Ubuntu kernel.

### Control Plane HA

Three control-plane nodes provide a fully fault-tolerant etcd cluster.
The quorum threshold is 2 — the cluster survives the loss of any single
control-plane node without service interruption.

---

## VM Provisioning

### Ubuntu Autoinstall

New VMs are provisioned via Ubuntu 24.04 Server autoinstall (cloud-config).
The canonical `user-data` template lives at:

```
receptor-infra/provisioning/user-data
```

Fill in the `REPLACE_*` placeholders before serving:

| Placeholder | Value |
|---|---|
| `REPLACE_NODE_HOSTNAME` | e.g. `receptor-work-10` |
| `REPLACE_CLUSTER_NODE_IP` | VLAN 10 static IP (e.g. `10.10.0.20/24`) |
| `REPLACE_SSH_PUBLIC_KEY` | Your `~/.ssh/id_ed25519.pub` |
| `REPLACE_PASSWORD_HASH` | `HISTFILE=/dev/null openssl passwd -6` |

Serve via HTTP (e.g. Python on your Mac) and reference in the Hyper-V boot
parameters as the autoinstall URL.

### k3s Join Commands

**After first boot**, SSH into the new node and run:

**Worker node:**
```bash
curl -sfL https://get.k3s.io | \
  K3S_URL="https://10.10.0.10:6443" \
  K3S_TOKEN="<token>" \
  sh -s - agent \
    --node-ip=<THIS_NODE_VLAN10_IP>
```

**Additional control-plane node:**
```bash
curl -sfL https://get.k3s.io | \
  K3S_URL="https://10.10.0.10:6443" \
  K3S_TOKEN="<token>" \
  sh -s - server \
    --flannel-backend=none \
    --disable-network-policy \
    --node-ip=<THIS_NODE_VLAN10_IP>
```

Retrieve the join token from any existing control-plane node (e.g. ctrl-10):
```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

### Kernel Configuration

All nodes must run `linux-azure`. If a node boots with the generic kernel:

```bash
# Install azure kernel
sudo apt-get install -y linux-azure

# Remove generic kernel to prevent grub symlink regression
sudo apt-get remove --purge linux-image-generic linux-image-6.8.0-*-generic \
  linux-headers-generic -y

# Update grub and reboot
sudo update-grub && sudo reboot
```

> [!IMPORTANT]
> If the `/boot/vmlinuz` symlink still points to a generic kernel after
> installing `linux-azure`, update it manually before rebooting:
> ```bash
> sudo ln -sf vmlinuz-6.17.0-1008-azure /boot/vmlinuz
> sudo ln -sf initrd.img-6.17.0-1008-azure /boot/initrd.img
> ```

---

## Workload Distribution (GitOps)

Workload scheduling is managed by k3s/Calico — pods are distributed across
worker nodes automatically. The control-plane nodes (`ctrl-10`, `ctrl-11`,
`ctrl-50`) are not schedulable for workload pods.

Key namespaces and their typical scheduling:

| Namespace | Workload | Notes |
|---|---|---|
| `arc-systems` | ARC controller + listener pods | Spread across workers |
| `arc-runners` | GitHub Actions runner pods | Ephemeral, on-demand |
| `supabase` | Production Supabase stack | DB stateful, others spread |
| `supabase-staging` | Staging Supabase stack | Spread across workers |
| `vault` | HashiCorp Vault | HA mode, single active |
| `monitoring` | kube-prometheus-stack, Loki | Spread across workers |
| `traefik` | Traefik ingress + Cloudflare tunnel | Spread across workers |
| `cert-manager` | cert-manager, cainjector, webhook | cert-manager namespace |
| `registry` | Zot OCI registry | Stateful, single pod |

---

## GitOps Lifecycle

All cluster changes go through `receptor-infra` on GitHub:

1. Edit manifests / `helmfile.yaml` / Helm values in `receptor-infra`
2. Open PR → triggers `terraform-plan.yml` for Terraform changes
3. Merge to `main` → triggers `cluster-sync` workflow
4. `cluster-sync` runs `helmfile sync` inside the cluster via
   `arc-runner-receptor-infra` (cluster-admin ServiceAccount)
5. Slack notification on failure via Vault OIDC (no static secrets)

See [receptor-infra README](../../receptor-infra/README.md) for full bootstrap
order and security model.
