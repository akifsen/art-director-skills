# Art Director

Mevcut projedeki arayüzü tasarlamak, dar kapsamda iyileştirmek veya
incelemek için kullanılan taşınabilir bir [Agent Skill](https://agentskills.io/specification).

Tema paketi seçmez. MCP sunucusu çalıştırmaz. Kullanmak için Node, API
anahtarı veya arka plan süreci gerekmez. `skills/art-director/` klasörünü
host’un skill dizinine kopyalamak yeterlidir.

[English README](README.md) · [Kurulum](docs/installation.md) · [Uyumluluk](docs/compatibility.md) · [Değerlendirme](evals/README.md) · [Geçiş](docs/migration.md)

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
0.9.0: iş türü ayrımı, Palatino/krem varsayılanının kırılması (yerine soğuk
gri keskin reçete koymadan), Rail Still öğreticisi ve okunur inquire eylemi.
[0.9.0 kanıt](evals/evidence/craft-finish-0.9.0/REPORT.md);
eylem kontrastı ve fotoğrafçı yeniden koşusu:
[action-quality](evals/evidence/action-quality-0.9.0/REPORT.md).
0.8.0: seefix CI kapısı ve skill/eval ayrımı. Cursor keşfi ayrı bir host
testidir: [0.8.0 kanıt](evals/evidence/ci-seefix-0.8.0/REPORT.md).
0.7.0 see-and-correct kaydı: [2026-09-20](evals/evidence/see-and-fix-2026-09-20/REPORT.md).
Önceki native işçilik kaydı ayrı tutulur: [0.6.0](evals/evidence/native-craft-2026-09-19/REPORT.md).
Dosya yoluyla açık skill kullanımı, Cursor'ın doğal keşfi olarak sunulmaz.
Önceki [0.5.0 karşılaştırması](evals/evidence/2026-09-19/REPORT.md) ayrı tutulur.

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
`$art-director`. Ajan, kullanıcının diliyle yanıtlar.

| Mod | Ne zaman | Varsayılan |
|---|---|---|
| DESIGN | Yeni arayüz veya açık yeniden tasarım | Tez, sonra bitmiş uygulama |
| REFINE | Var olan arayüzün belirli parçası | Yalnızca o parça, yine işlenmiş |
| REVIEW | İnceleme | Salt okunur |

## Lisans

[MIT](LICENSE).
