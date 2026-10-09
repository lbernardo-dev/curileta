# Regla de Limpieza Obligatoria al Finalizar Tareas

Al finalizar cualquier sesión, comando o trabajo en este repositorio:
1. Purgar siempre todos los archivos temporales y complementarios de macOS (`._*`).
2. Eliminar cualquier archivo de logs (`*.log`).
3. Ejecutar `dot_clean -m` sobre el directorio del proyecto para prevenir la acumulación de metadatos de ExFAT.
4. Asegurar que `git status` quede limpio de archivos residuales.
