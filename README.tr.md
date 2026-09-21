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
npx --yes art-director-skills@0.10.1 install --ai cursor           # → .cursor/skills/art-director
npx --yes art-director-skills@0.10.1 install --ai claude,codex     # birden çok asistan
npx --yes art-director-skills@0.10.1 install --ai cursor --global  # proje yerine ~/.cursor/skills
npx --yes art-director-skills@0.10.1 install --ai cursor --dry-run # yalnız plan
npx --yes art-director-skills@0.10.1 status  --ai cursor
npx --yes art-director-skills@0.10.1 list
npx --yes art-director-skills@0.10.1 remove  --ai cursor
npx --yes art-director-skills@0.10.1 --version
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

Yayımlanan ikili yalnızca `art-director-skills`. `npx art-director`
kullanma: registry’de başka bir pakettir. 0.10.0 o adı bin takma adı
yapınca Windows `npx art-director-skills` komutu `art-director` çalıştırmaya
kalkıyordu.

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

Kullandığınız asistan için kurun, sonra **art-director**’ı o hostta
çağırın. Kendi dilinizde yazın. Her yerde aynı skill; ekstra komut yok.
İstek zaten birini ima ediyorsa DESIGN / REFINE / REVIEW yazmayın.

Aşağıdaki çağrı biçimleri her hostun skill belgesinden. Bu skill’in
oturumda listelendiği kayıt **Cursor** için var; diğerleri kurulum
yolu olarak test edildi, o hostun burada açıldığı anlamına gelmez.
Ayrıntı: [docs/compatibility.md](docs/compatibility.md).

### Cursor

```bash
npx --yes art-director-skills@0.10.1 install --ai cursor
```

Dosyalar: `.cursor/skills/art-director/`. **Agent** sohbetinde:

```text
/art-director Bu site için rezervasyon akışı tasarla. Mevcut yığını koru.
```

Ya da doğal isteyin (“ayarlar sayfasını tasarla”); Cursor açıklamadan
seçebilir. `/art-director` o mesaja skill’i bağlar. Aynı repoda `--ai
all` ile birlikte kurmayın — Cursor `.agents/skills/` dizinini de okur,
skill iki kez görünür.

### Gemini CLI

```bash
npx --yes art-director-skills@0.10.1 install --ai gemini
```

Bu, `.gemini/skills/art-director/` yazar (Gemini’nin kendi ağacı). CLI
**ayrıca** `.agents/skills/` alias’ını tarar. İkisinin de proje kopyası
yalnız klasör **güveniliyorsa** yüklenir. `/skills list` boş kaldıysa ve
`.gemini` → `.agents` deyince göründüyse neden budur (veya yalnız
alias’ı listeleyen eski CLI). Sonra:

```text
/trust
/skills reload
/skills list
```

`art-director` görünmeli. Gemini skill’i açmadan onay ister.

Hâlâ boşsa Gemini’nin gördüğü alias’a kurun:

```bash
npx --yes art-director-skills@0.10.1 install --ai codex
```

Bu `.agents/skills/art-director/` — aynı `SKILL.md` düzeni, ikinci bir
skill değil. Bu Gemini sürümü ikisini de okuyorsa
`.gemini/skills/art-director` ile `.agents/skills/art-director` birlikte
durmasın; iki kez listelenir. `--global` → `~/.gemini/skills/` ve
workspace güveni aranmaz.

### Claude Code

```bash
npx --yes art-director-skills@0.10.1 install --ai claude
```

Dosyalar: `.claude/skills/art-director/`. `/art-director` yazın veya
açıklamayla eşleşen bir arayüz sorusu sorun. `/skills` yüklü skill’leri
listeler.

### Codex

```bash
npx --yes art-director-skills@0.10.1 install --ai codex
```

Dosyalar: `.agents/skills/art-director/`. Codex CLI / IDE: `/skills`
veya `$art-director`. ChatGPT masaüstü: `@` ile skill.

### GitHub Copilot

```bash
npx --yes art-director-skills@0.10.1 install --ai copilot
```

Dosyalar: `.github/skills/art-director/` (proje) veya `~/.copilot/skills/`
(`--global`). Copilot CLI’de `/skills reload`, sonra:

```text
/art-director Gösterge panelini incele. Dosya değiştirme.
```

Copilot slash olmadan da açıklamadan seçebilir. `/skills list` ve
`/skills info art-director` yüklendiğini doğrular.

### Kiro

```bash
npx --yes art-director-skills@0.10.1 install --ai kiro
```

Dosyalar: `.kiro/skills/art-director/`. Sohbette `/art-director` veya
doğal arayüz isteği. Varsayılan ajan bu klasörü yükler. **Özel** bir
ajan için `resources` içine `"skill://.kiro/skills/**/SKILL.md"` gerekir.

### OpenCode ve diğerleri

| Host | Kurulum | Klasör | Kullanım |
|---|---|---|---|
| OpenCode | `--ai opencode` | `.opencode/skills/` | `skill` aracı: ad `art-director` |
| Qoder | `--ai qoder` | `.qoder/skills/` | Skill listesi / hostun `/art-director` belgesi |
| Roo Code | `--ai roocode` | `.roo/skills/` | aynı |
| Continue | `--ai continue` | `.continue/skills/` | aynı |
| CodeBuddy | `--ai codebuddy` | `.codebuddy/skills/` | aynı |
| Droid | `--ai droid` | `.factory/skills/` | aynı |
| Kilo Code | `--ai kilocode` | `.kilocode/skills/` | aynı |

Tüm projeler için: `--global` (ev dizini skill klasörü). Yollar:
[docs/installation.md](docs/installation.md#bundled-installer).

```text
DESIGN — yeni arayüz veya açık yeniden tasarım
Bu site için bir rezervasyon akışı tasarla. Mevcut yığını koru. Yalnızca
ilk ekranı değil; liste, detay ve boş durumları da bitir.

REFINE — var olan arayüzün belirli parçası
640px altında mobil menü kullanılamıyor. Yalnızca onu değiştir.

REVIEW — inceleme
Gösterge panelini incele: hiyerarşi, tipografi, kontrast ve boş
durumlar. Dosya değiştirme.
```

| Mod | Ne zaman | Varsayılan |
|---|---|---|
| DESIGN | Yeni arayüz veya açık yeniden tasarım | Tez, sonra bitmiş uygulama |
| REFINE | Var olan arayüzün belirli parçası | Yalnızca o parça, yine işlenmiş |
| REVIEW | İnceleme | Salt okunur |

## Lisans

[MIT](LICENSE).
