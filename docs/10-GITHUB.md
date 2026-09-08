# Subir Ecoamigos a GitHub

[Índice](00-INDICE.md)

## Situación de esta copia

Se comprobó localmente:

- Carpeta: `C:\Users\Oscar Prada\Documents\ecoamigos-web\ecoamigos-web`.
- Rama: `main`.
- Remoto origin: `https://github.com/oscarprada/ecoamigos-web.git`.
- Existen cambios visuales del trabajo anterior y documentación nueva sin commit.

No se hizo commit, push, cambio de visibilidad ni modificación remota durante la documentación. La configuración local no garantiza que la cuenta actual tenga acceso de escritura o que el repositorio remoto esté sincronizado.

## 1. Abrir PowerShell en el proyecto

```powershell
Set-Location 'C:\Users\Oscar Prada\Documents\ecoamigos-web\ecoamigos-web'
git status
git branch --show-current
git remote -v
```

Para esta copia no ejecutar `git init` ni `git remote add origin`: ya están configurados. Los comandos generales para vincular código están en [GitHub: agregar código local](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

## 2. Identidad y autenticación

Comprobar la identidad de autor:

```powershell
git config user.name
git config user.email
```

Si falta, definirla solo para este repositorio con tus valores:

```powershell
git config user.name 'REEMPLAZAR_NOMBRE'
git config user.email 'REEMPLAZAR_CORREO_O_NOREPLY_DE_GITHUB'
```

La identidad del commit no inicia sesión. Al hacer fetch/push por HTTPS, Git Credential Manager puede abrir la autenticación de GitHub. Si el entorno pide un token, usar uno con acceso limitado a este repositorio y permisos necesarios para escribir contenido; no la contraseña de la cuenta ni un token incluido en la URL. Nunca guardar tokens en README, `.env.example` o capturas compartidas. Ver [gestión de remotos y autenticación HTTPS](https://docs.github.com/en/get-started/git-basics/managing-remote-repositories).

## 3. Revisar lo que se publicará

```powershell
git diff --stat
git diff --check
git status --short
git ls-files -- backend/.env frontend/.env
git check-ignore backend/.env frontend/.env backend/uploads/ejemplo.png
```

`git ls-files` para los dos `.env` debe quedar sin resultados. `git check-ignore` debe mostrar las rutas ignoradas. `.gitignore` excluye node_modules, `.env` y variantes privadas, dist/build, logs, uploads y backups; conserva `.env.example`.

No incluir bases reales, respaldos, evidencias, reportes con nombres, claves ni JWT. Los archivos ya rastreados no dejan de estarlo por agregarlos a `.gitignore`; por ejemplo desktop.ini existe históricamente en Git. Si un secreto se publicó antes, ignorarlo o borrarlo de la versión actual no lo elimina del historial: revocar/rotar y seguir el [procedimiento oficial para datos sensibles](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

Esta guía no realiza una auditoría completa del historial. Revisar la autorización institucional para compartir el repositorio y sus activos; no hay una licencia definida en el código.

## 4. Comprobar build

```powershell
npm --prefix frontend run build
```

Si falta node_modules, instalar antes con `npm --prefix frontend ci`. `frontend/dist` no se agrega al repositorio: es generado. Un error de build se resuelve antes del commit; warnings deben revisarse sin asumir que son fallos.

## 5. Preparar archivos y hacer commit

Para incluir **documentación y ajustes de estilos de esta sesión**, seleccionar sus rutas:

```powershell
git add README.md docs .gitignore frontend/.env.example frontend/src
git diff --cached --stat
git diff --cached --check
```

Revisar el contenido seleccionado localmente:

```powershell
git diff --cached
```

No compartir esa salida sin revisar información privada. Si el conjunto es el esperado:

```powershell
git commit -m 'Documenta Ecoamigos y actualiza estilos visuales'
```

Si deseas **solo documentación**, en lugar del primer git add usar:

```powershell
git add README.md docs .gitignore frontend/.env.example
```

Y utilizar el mensaje `Documenta arquitectura, instalacion y operacion de Ecoamigos`. Las modificaciones visuales quedarían pendientes. No ejecutar ambas alternativas sin revisar el área preparada. El commit incluye todo lo que ya estuviera en staging, no solo el último git add.

## 6. Sincronizar y subir

Obtener referencias remotas sin cambiar archivos locales:

```powershell
git fetch origin
git branch -r
git status
```

Si aparece `origin/main` y el árbol está limpio después del commit:

```powershell
git pull --rebase origin main
```

Si el remoto está vacío y no tiene main, omitir ese pull. Si elegiste commit solo documental y siguen cambios visuales locales, no iniciar rebase con cambios sin guardar: confirmar también esos cambios o conservarlos mediante un flujo consciente antes de sincronizar.

Cuando no haya conflictos:

```powershell
git push -u origin main
```

`-u` configura seguimiento para futuros pushes. Comprobar que el comando terminó correctamente y abrir el repositorio en GitHub para revisar el último commit, README y docs. Esta operación sube archivos, **no despliega la web ni sube PostgreSQL/uploads**. Referencia: [GitHub, git push](https://github.com/git-guides/git-push).

## 7. Errores habituales

| Mensaje | Qué hacer |
| --- | --- |
| `remote origin already exists` | Ya está configurado; revisar git remote -v |
| `Repository not found` | Revisar URL, existencia y acceso de la cuenta |
| `Authentication failed` | Renovar autenticación/token con acceso al repositorio |
| `non-fast-forward` | Fetch y rebase con árbol limpio; no usar force para saltarlo |
| `src refspec main does not match any` | Revisar rama actual y existencia de commit |
| `nothing to commit` | Revisar git status; puede estar ya confirmado o faltan archivos preparados |
| `Author identity unknown` | Configurar user.name y user.email locales |
| Push bloqueado por secretos | Retirar el secreto del commit y rotarlo si se expuso; no eludir protección |
| Push bloqueado por regla de rama | Publicar rama de trabajo y abrir Pull Request según política del repositorio |
| Avisos LF/CRLF | Revisar git diff --check; no cambiar todo el formato del proyecto sin necesidad |

Si hay conflicto de rebase, Git lista los archivos. Editarlos conservando la intención de ambos cambios, eliminar marcadores de conflicto, ejecutar git add para los archivos resueltos y `git rebase --continue`. Para cancelar el rebase en curso: `git rebase --abort`. No forzar push ni descartar trabajo con reset hard.

Si main está protegida, después del commit crear una rama de trabajo de nombre libre:

```powershell
git switch -c docs/documentacion-proyecto
git push -u origin docs/documentacion-proyecto
```

Abrir Pull Request hacia main en GitHub; no asumir permisos para saltar revisiones.

## 8. Usar otro repositorio

Solo si deseas un destino diferente: crear en GitHub un repositorio vacío con la visibilidad autorizada, sin README/licencia/gitignore iniciales. En esta copia, puedes añadir otro remoto sin perder origin:

```powershell
git remote add nuevo https://github.com/REEMPLAZAR_USUARIO/REEMPLAZAR_REPOSITORIO.git
git remote -v
git push -u nuevo main
```

O, si la intención es reemplazar definitivamente origin, utilizar `git remote set-url origin <URL_NUEVA>` y verificarlo antes de push. No mezclar ambas opciones sin decidir el destino. La [guía de remotos](https://docs.github.com/en/get-started/git-basics/managing-remote-repositories) explica estas operaciones.

## 9. Actualizaciones posteriores

Con árbol limpio, sincronizar antes de editar. Después de trabajar: revisar cambios, probar, preparar rutas concretas, revisar staging, hacer commit y push. Mantener docs junto al código y no confirmar secretos, datos ni archivos generados. GitHub permite leer Markdown y diagramas Mermaid directamente en el repositorio.
