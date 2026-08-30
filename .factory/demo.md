# Performed For demo sandbox

Open `/demo` (or `/?demo=1`) to load a completed Northline Studio invoice example. It includes a realistic one-page sample invoice, its billing client, end client, project reference, and one sample relationship-log row. The source invoice is created in browser memory only.

The persistent **Demo — sample data, nothing is saved** banner offers **Reset demo** and **Start for real**. The first demo visit seeds only the `demo:performed-for` IndexedDB database. Demo changes survive a reload so visitors can verify the local relationship log. **Reset demo** clears that database and the `demo:pf_generation_count` key before restoring the sample. **Start for real** deletes both demo stores before opening the ordinary workspace. The ordinary workspace uses the separate `performed-for` database and `pf_generation_count` key. Demo mode never reads or writes those real-data namespaces and does not run license verification.

Use the sample to generate a combined PDF, inspect the relationship log, export CSV, or download and re-import a version 1 JSON backup. Start for real returns to `/`, discards the demo namespace, and leaves the visitor’s records untouched.
