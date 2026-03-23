# Receptor Cluster Infrastructure

Physical hosts, virtual machines, and k3s cluster topology for the Receptor
on-premises infrastructure.

---

## Physical Hosts

The Receptor cluster runs across two physical Windows 11 machines acting as
Hyper-V hypervisors, plus one bare-metal MacBook Pro worker, all on a shared
VLAN 10 network (`10.10.0.0/24`).

### HYPERV-1 — SPACESHIP

The original cluster host. Runs the majority of production workloads.

| Component | Detail |
|---|---|
| **Motherboard** | *(not recorded — see HWiNFO on host)* |
| **OS** | Windows 11 Pro, Hyper-V enabled |
| **Role** | Primary hypervisor — ctrl-01, ctrl-50, work-01 |

**Virtual Machines**

| VM Name | State | vCPU | RAM | VLAN 10 IP | Role |
|---|---|---|---|---|---|
| `receptor-ctrl-01` | Running | 2 | 8 GB | 10.10.0.11 | k3s control-plane + etcd |
| `receptor-work-01` | Running | 16 | 12 GB | 10.10.0.21 | k3s worker (consolidated) |
| `receptor-ctrl-50` | Running | 10 | 1 GB | 10.10.0.50 | k3s control-plane + etcd |
| `common-bond` | Off | — | — | — | Reserved |
| `Florence` | Off | — | — | — | Reserved |
| `VOYAGER` | Off | — | — | — | Reserved (Gen 1) |

> **CI-SPEED-01 (2026-03-20):** Hyper-V `receptor-work-02` VM decommissioned. `receptor-work-01` consolidated to 16 vCPU / 12 GB RAM.
> **2026-03-23:** `receptor-work-02` re-provisioned as a bare-metal MacBook Pro 2016 worker at `10.10.0.22`.

---

### HYPERV-2 — New PC (added 2026-03-16)

Second physical host added 2026-03-16. Runs the HA control-plane peer and a
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
| `receptor-work-10` | Running | 6 | 8 GB | 10.10.0.20 | k3s worker |

---

### BARE-METAL-1 — receptor-work-02 (added 2026-03-23)

MacBook Pro 2016 repurposed as a bare-metal k3s worker. Runs Ubuntu 24.04 LTS
directly on hardware (no hypervisor). VLAN 10 is carried as an 802.1q tagged
interface on the USB-C Ethernet adapter.

| Component | Detail |
|---|---|
| **Model** | MacBook Pro 13" (Late 2016) |
| **CPU** | Intel Core i5-6267U @ 2.90 GHz (2 cores / 4 threads, Skylake) |
| **RAM** | 16 GB LPDDR3 (on-die) |
| **Storage** | Apple SSD AP0256J (256 GB NVMe PCIe) — 98 GB LVM root, ~134 GB available |
| **NIC** | USB-C Ethernet adapter (`enxf8e43b53b9d2`, 1 GbE) |
| **OS** | Ubuntu 24.04.4 LTS |
| **Kernel** | `6.8.0-106-generic` (stock Ubuntu LTS — HWE intentionally excluded) |
| **k3s** | v1.34.5+k3s1 (agent only) |

| Interface | Config | Purpose |
|---|---|---|
| `enxf8e43b53b9d2` | DHCP (`192.168.1.x`) | Management SSH / internet egress |
| `vlan10@enxf8e43b53b9d2` | Static `10.10.0.22/24` | k3s cluster-internal traffic |

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
| 10.10.0.10 | receptor-ctrl-10 | control-plane + etcd | HYPERV-2 |
| 10.10.0.11 | receptor-ctrl-01 | control-plane + etcd | HYPERV-1 |
| 10.10.0.12 | receptor-ctrl-02 | *(reserved)* | — |
| 10.10.0.13 | receptor-ctrl-03 | *(reserved)* | — |
| 10.10.0.20 | receptor-work-10 | worker | HYPERV-2 |
| 10.10.0.21 | receptor-work-01 | worker | HYPERV-1 |
| 10.10.0.22 | receptor-work-02 | worker | BARE-METAL-1 (MacBook Pro 2016) |
| 10.10.0.23 | receptor-work-03 | *(reserved)* | — |

---

## k3s Cluster

**Version:** k3s v1.34.5+k3s1  
**CNI:** Calico (tigera-operator), flannel backend disabled  
**Container runtime:** containerd 2.1.5-k3s1

### Nodes

| Node | Role | IP | vCPU | RAM (allocatable) | Kernel |
|---|---|---|---|---|---|
| receptor-ctrl-01 | control-plane, etcd | 10.10.0.11 | 2 | ~7.8 GB | 6.17.0-1008-azure |
| receptor-ctrl-10 | control-plane, etcd | 10.10.0.10 | 6 | ~7.8 GB | 6.17.0-1008-azure |
| receptor-ctrl-11 | control-plane, etcd | 10.10.0.30 | 6 | ~7.8 GB | 6.17.0-1008-azure |
| receptor-ctrl-50 | control-plane, etcd | 10.10.0.50 | 10 | ~1.0 GB | 6.17.0-1008-azure |
| receptor-work-01 | worker | 10.10.0.21 | 16 | ~11.4 GB | 6.17.0-1008-azure |
| receptor-work-02 | worker | 10.10.0.22 | 4 (2c/4t) | ~14.5 GB | 6.8.0-106-generic |
| receptor-work-10 | worker | 10.10.0.20 | 6 | ~7.8 GB | 6.17.0-1008-azure |

**Total cluster capacity (post 2026-03-23):** 50 vCPU, ~58 GB RAM  
Workers: `work-01` (SPACESHIP, 16 vCPU, 11.4 GB) + `work-02` (MacBook, 4 vCPU, 14.5 GB) + `work-10` (ENTERPRISE, 6 vCPU, 7.8 GB) = 26 vCPU, ~33.7 GB scheduling capacity

> [!NOTE]
> Hyper-V VMs run `linux-azure` (synthetic NIC drivers, dynamic memory ballooning,
> improved I/O throughput). `receptor-work-02` runs `linux-generic` — the HWE
> kernel is intentionally excluded to avoid MacBook thermal/driver regressions.

### Control Plane HA

Two control-plane nodes provide etcd quorum. A third control-plane node
(`receptor-ctrl-02` at `10.10.0.12`) could be added from either host to
reach a 3-node etcd cluster for full fault tolerance.

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
  K3S_URL="https://10.10.0.11:6443" \
  K3S_TOKEN="$(sudo cat /var/lib/rancher/k3s/server/node-token on ctrl-01)" \
  sh -s - agent \
    --node-ip=<THIS_NODE_VLAN10_IP>
```

**Additional control-plane node:**
```bash
curl -sfL https://get.k3s.io | \
  K3S_URL="https://10.10.0.11:6443" \
  K3S_TOKEN="<token>" \
  sh -s - server \
    --flannel-backend=none \
    --disable-network-policy \
    --node-ip=<THIS_NODE_VLAN10_IP>
```

Retrieve the join token from ctrl-01:
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
worker nodes automatically. The control-plane nodes (`ctrl-01`, `ctrl-10`) are
not schedulable for workload pods.

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
