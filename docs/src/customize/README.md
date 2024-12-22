This directory contains artefacts (mostly type definitions, colors, icons) that kolibri depends upon
but are to be customized by the web application that uses the kolibri.

With this construction, one can keep the kolibri directory free of 
app-specific modifications 
such that upgrading to a newer kolibri version is less of an issue.
Simply swap out the kolibri directory.

Also, kolibri should never depend on anything outside its own
directory or this specific "customize" directory.
