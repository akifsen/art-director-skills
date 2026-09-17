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

Skill, host ajana şunu öğretir: mevcut yığını ve korunacakları oku, içeriğe
hiyerarşi ver, somut bir görsel tez yaz, kararları ayrı ayrı al, uygulama
istendiyse gerçek dosyaları değiştir, görsel kontrol ile teknik kontrolü
ayır.

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

Depo herkese açık olduktan sonra planlanan komut:

```sh
npx skills add akifsen/art-director-skills --skill art-director --agent cursor --copy
```

`npx skills` telemetrisi o CLI’ye aittir; `DISABLE_TELEMETRY=1` veya
`DO_NOT_TRACK=1` ile kapatılır.

## Kullanım

Cursor’da `/art-director` veya doğal bir arayüz talebi. Codex’te
`$art-director`. Ajan, kullanıcının diliyle yanıtlar.

| Mod | Ne zaman | Varsayılan |
|---|---|---|
| DESIGN | Yeni arayüz veya açık yeniden tasarım | Tez, sonra uygulama |
| REFINE | Var olan arayüzün belirli parçası | Yalnızca o parça |
| REVIEW | İnceleme | Salt okunur |

## Lisans

[MIT](LICENSE).
