# Art Director

Mevcut projedeki arayüzü tasarlamak, dar kapsamda iyileştirmek veya
incelemek için kullanılan taşınabilir bir [Agent Skill](https://agentskills.io/specification).

Tema paketi seçmez. MCP sunucusu çalıştırmaz. Kullanmak için Node, API
anahtarı veya arka plan süreci gerekmez. `skills/art-director/` klasörünü
host’un skill dizinine kopyalamak yeterlidir.

[English README](README.md) · [Kurulum](docs/installation.md) · [Uyumluluk](docs/compatibility.md) · [Değerlendirme](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/README.md) · [Geçiş](docs/migration.md)

## Ne işe yarar

Yeni bir sayfa, açık bir yeniden tasarım, sınırlı bir düzeltme (örneğin
mobil menü) veya görsel inceleme istendiğinde.

Skill, host ajana şunu öğretir: mevcut yığını, platformu (web veya native)
ve arayüz temelini (mevcut tasarım sistemi, yerel primitives veya başlangıç
projesi) oku; içeriğe hiyerarşi ver; geniş DESIGN işinde görülebilen güncel
referanslara bak; somut bir görsel tez yaz; ortak bir bileşen/sayfa dili
kur veya geliştir; istenen ekranları, akışları ve durumları bitir; uygulama
istendiyse gerçek dosyaları değiştir; dört kabul kapısını (yükleme/işlev,
işçilik, kapsam, platform/erişilebilirlik) ayır.

Geniş DESIGN işinde ilk gerçek ekranı görsel olarak inceleyip gerekli
düzeltmeyi yapmadan tasarımı bütün ekranlara yaymaz. Engellenmiş kontrol,
geçmiş kontrol sayılmaz: tamamlandı / kısmi teslim / tamamlanmadı ayrılır.
0.9.1: seçili+hover ve focus halkası gibi durum birleşimlerinin tasarlanması,
halkanın üzerinde durduğu yüzeye göre ölçülmesi, "ilk viewport'u doldur"
yerine içerikten gelen kap kararı. [0.9.1 kanıt](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/state-craft-0.9.1/REPORT.md).
0.9.0: iş türü ayrımı, Palatino/krem varsayılanının kırılması (yerine soğuk
gri keskin reçete koymadan), Rail Still öğreticisi ve okunur inquire eylemi.
[0.9.0 kanıt](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/craft-finish-0.9.0/REPORT.md);
eylem kontrastı ve fotoğrafçı yeniden koşusu:
[action-quality](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/action-quality-0.9.0/REPORT.md).
0.8.0: seefix CI kapısı ve skill/eval ayrımı. Cursor keşfi ayrı bir host
testidir: [0.8.0 kanıt](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/ci-seefix-0.8.0/REPORT.md).
0.7.0 see-and-correct kaydı: [2026-09-20](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/see-and-fix-2026-09-20/REPORT.md).
Önceki native işçilik kaydı ayrı tutulur: [0.6.0](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/native-craft-2026-09-19/REPORT.md).
Dosya yoluyla açık skill kullanımı, Cursor'ın doğal keşfi olarak sunulmaz.
Önceki [0.5.0 karşılaştırması](https://github.com/akifsen/art-director-skills/blob/v0.10.0/evals/evidence/2026-09-19/REPORT.md) ayrı tutulur.

Yalnızca doğru palet yetmez. Kullanıcı wireframe istemediyse ilk iskelet
teslim değildir. Bilinçli sadeleştirme kusur değildir; işlenmemiş boşluk
ve varsayılan HTML kusurdur. Native uygulama, web sitesinin mobil menüsü
değildir.

Backend, SQL, migration veya yayın işlerinde kendiliğinden tasarım
başlatmamalıdır.

## Ne değildir

- `@akifsen/art-director-mcp` paketinin yeni sürümü değildir
- Hazır site kataloğu değildir
- Estetik garanti değildir
- Yeni tarayıcı, görsel model veya ek yetki sağlamaz

## Kurulum

Çevrimdışı kopya yeterlidir. Ayrıntı: [docs/installation.md](docs/installation.md).

### Hızlı Kurulum (npx, tam skill)

Önerilen kurulum, **skill'in tamamını** — aynı paket sürümündeki `SKILL.md`,
`references/`, `assets/` — adını verdiğin asistanın aradığı klasöre kopyalar.
Asistanı ve kapsamı sen seçersin; seçmeden hiçbir şey yazılmaz. Sürümü
sabitle:

```bash
npx art-director-skills@0.10.0 install --ai cursor          # → .cursor/skills/art-director
npx art-director-skills@0.10.0 install --ai claude,codex    # birden çok asistan
npx art-director-skills@0.10.0 install --ai cursor --global # proje yerine ~/.cursor/skills
npx art-director-skills@0.10.0 status  --ai cursor
npx art-director-skills@0.10.0 --version
```

Bağımlılık yok, paket indikten sonra ağ yok, telemetri yok, postinstall yok.
Argümansız çalıştırma kullanımı yazdırır, dosya yazmaz. Mevcut klasörün
üzerine sessizce yazılmaz: aynı içerik → `current`, farklı → `conflict`
(çıkış 2, değişiklik yok); `--force` değiştirir ve önceki klasörü yanında
`art-director.bak-<zaman>` olarak saklar. Hedefte, üst yolunda veya içinde
sembolik bağlantı/junction varsa işlem hiçbir şey değiştirmeden reddedilir;
`--force` bunu aşmaz. `--dry-run` yalnız planı yazar. Ayrıntı ve güvenlik
modeli: [docs/installation.md](docs/installation.md#bundled-installer).

**0.10.0'da değişti (güvenlik).** 0.9.1'deki kısayollar — `npx
art-director-skills` (`SKILL.md` yazardı), `--cursor` (`.cursorrules`),
`--claude` (`CLAUDE.md`) — mevcut talimat dosyalarının üzerine yazıyor ve
sembolik bağlantıları takip ediyordu. Artık bir mesajla duruyor, dosya
yazmıyor. `SKILL.md`, `.cursorrules`, `CLAUDE.md`, `AGENTS.md` dosyalarına
bu paket dokunmaz. Bkz. [docs/migration.md](docs/migration.md).

`art-director` ve `art-director-skill`, *kurulu* paketin bin eş adlarıdır
(`npm i -D art-director-skills` sonrası `npm exec art-director -- --version`).
`npx art-director` komutunu bu paketin kısayolu sanma: npx nitelenmemiş adı
registry'de arar ve o ad bu paket değildir.

Klondan: `node bin/cli.js install --ai cursor`.

| `--ai` | Asistan | Proje yolu | Genel yol (`--global`) |
|---|---|---|---|
| `claude` | Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| `cursor` | Cursor | `.cursor/skills/` | `~/.cursor/skills/` |
| `copilot` | GitHub Copilot (VS Code, CLI, bulut ajanı) | `.github/skills/` | `~/.copilot/skills/` |
| `kiro` | Kiro | `.kiro/skills/` | `~/.kiro/skills/` |
| `codex` | Codex CLI / IDE | `.agents/skills/` | `~/.agents/skills/` |
| `qoder` | Qoder IDE / CLI | `.qoder/skills/` | `~/.qoder/skills/` |
| `roocode` | Roo Code | `.roo/skills/` | `~/.roo/skills/` |
| `gemini` | Gemini CLI | `.gemini/skills/` | `~/.gemini/skills/` |
| `opencode` | OpenCode | `.opencode/skills/` | `~/.config/opencode/skills/` |
| `continue` | Continue IDE eklentisi | `.continue/skills/` | `~/.continue/skills/` |
| `codebuddy` | CodeBuddy CLI | `.codebuddy/skills/` | `~/.codebuddy/skills/` |
| `droid` | Droid (Factory) | `.factory/skills/` | `~/.factory/skills/` |
| `kilocode` | Kilo Code | `.kilocode/skills/` | `~/.kilocode/skills/` |
| `all` | yukarıdakilerin hepsi | hepsi | hepsi |

Var olan klasör `--force` verilmeden değiştirilmez. `remove --ai <id>`
yalnızca içinde `SKILL.md` olan klasörü siler. `all` on üç kopya yazar;
`.agents/skills/` veya `.claude/skills/` dizinlerini de okuyan hostlar
skill'i iki kez listeler, bu yüzden kullandığınız asistanları adıyla
verin. Yollar her üreticinin belgelediği yollardır
([docs/compatibility.md](docs/compatibility.md#supported-assistants)).
Yükleyici on üç asistan için kurulum testinden geçer; gerçek oturumda
keşif yalnızca çalıştırıldığı yerde kayıtlıdır.

### Vercel `skills` CLI (üçüncü taraf)

Yerel dizin:

```powershell
$env:DISABLE_TELEMETRY = "1"
npx skills add C:\path\to\art-director-skills --skill art-director --agent cursor --copy --yes
```

Herkese açık depo:

```sh
npx skills add akifsen/art-director-skills --skill art-director --agent cursor --copy
```

Eski bir kopyanız varsa yerel değişiklikleri önce yedekleyin, sonra klasörü
birleştirmeden değiştirin. [docs/installation.md](docs/installation.md#update-an-older-copy).

`npx skills` telemetrisi o CLI’ye aittir; `DISABLE_TELEMETRY=1` veya
`DO_NOT_TRACK=1` ile kapatılır.

## Kullanım

Cursor’da `/art-director` veya doğal bir arayüz talebi. Codex’te
`$art-director`. Claude Code, Copilot, Gemini CLI, Kiro, OpenCode, Qoder,
Roo Code, Kilo Code, Continue, CodeBuddy ve Droid’de skill `art-director`
adıyla listelenir; açıklamasından seçilir ya da hostun skill komutuyla
(`/skills`, `/art-director`, `skill` aracı) çağrılır. Ajan, kullanıcının
diliyle yanıtlar.

| Mod | Ne zaman | Varsayılan |
|---|---|---|
| DESIGN | Yeni arayüz veya açık yeniden tasarım | Tez, sonra bitmiş uygulama |
| REFINE | Var olan arayüzün belirli parçası | Yalnızca o parça, yine işlenmiş |
| REVIEW | İnceleme | Salt okunur |

## Lisans

[MIT](LICENSE).
