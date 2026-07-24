    <footer class="border-t border-term-border bg-term-panel">
        <div class="mx-auto max-w-5xl px-4 py-8 text-sm text-term-dim">
            <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <p>
                    <span class="text-term-green">$</span> echo "&copy; <?= date('Y') ?> <?= e($profile['name'] ?? '') ?>"
                </p>
                <p class="text-xs">
                    Construit avec <span class="text-term-green">PHP</span> ·
                    <span class="text-term-green">Tailwind</span> ·
                </p>
            </div>
            <p class="mt-4 text-xs text-term-border">
                <span class="text-term-dim">process exited with code 0</span>
                <span class="cursor align-middle"></span>
            </p>
        </div>
    </footer>

    <script src="assets/js/terminal.js"></script>
    </body>

    </html>