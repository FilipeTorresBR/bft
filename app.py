import math
from matplotlib import pyplot as plt
import eel
import io
import base64

eel.init('web')
@eel.expose
def auto_calculate(value, name, dependency):
    if name == "y1_nib":
        y1_q = ((1.2)/value**0.55)
        y1_h = ((1.2)/value**1.1)
        qb_m3s = dependency.get('qti') / y1_q
        qb_m3h = qb_m3s * 3600
        hb = dependency.get('hti') / y1_h
        n_rps = dependency.get('n_rpm') / 60
        y1_ns_rps = (n_rps * qb_m3s**0.5)/(9.81*hb)**0.75
        y1_ns_rad = 2*math.pi*y1_ns_rps
        return {"y1_q":y1_q, "y1_h":y1_h, "qb_m3s":qb_m3s, "qb_m3h":qb_m3h, "hb":hb, "n_rps":n_rps, "y1_ns_rps":y1_ns_rps, "y1_ns_rad":y1_ns_rad}

    elif name == "y2_nb":
        y2_q = ((1.2)/value**0.55)
        y2_h = ((1.2)/value**1.1)
        qt_m3s = dependency.get('qb_m3s') * y2_q
        qt_m3h = qt_m3s * 3600
        ht_m = dependency.get('hb') * y2_h
        fi_bept = ((qt_m3s) / ((dependency.get('n_rps')) * (dependency.get('d') ** 3)))
        psi_bept = (9.81*ht_m) / ((dependency.get('n_rps') * dependency.get('d'))**2)
        y2_ns_rps = (dependency.get('n_rps') * qt_m3s**0.5)/(9.81*dependency.get('hb'))**0.75
        y2_ns_rad = 2*math.pi*y2_ns_rps
        return {"y2_q":y2_q, "y2_h":y2_h, "qt_m3s":qt_m3s, "qt_m3h":qt_m3h, "ht_m":ht_m, "fi_bept":fi_bept, "psi_bept":psi_bept, "y2_ns_rps":y2_ns_rps, "y2_ns_rad":y2_ns_rad}


@eel.expose
def generate_plot(dependency):
    fi_t = []
    psi_t = []
    eta_t = []
    qt_ls = []
    h_m = []
    fi_t.append(dependency.get('fi_bept'))
    for x in range(1, 40):
        fi_t.insert(0, fi_t[x - 1] - (0.003 * x))

    for x in range(40, 60):
        fi_t.append(fi_t[x - 1] + 0.003)

    for x in range(0, len(fi_t)):
        psi_t.append(dependency.get('psi_bept')*(0.2394*(fi_t[x]/dependency.get('fi_bept'))**2 + 0.769*(fi_t[x]/dependency.get('fi_bept'))))
        eta_t.append(((-1.9788*((fi_t[x]/dependency.get('fi_bept'))**6))+(9.0636*((fi_t[x]/dependency.get('fi_bept'))**5))-(13.148*((fi_t[x]/dependency.get('fi_bept'))**4))+(3.8527*((fi_t[x]/dependency.get('fi_bept'))**3))+(4.5614*((fi_t[x]/dependency.get('fi_bept'))**2))-(1.3769*((fi_t[x]/dependency.get('fi_bept')))))*(dependency.get('nb')))
        qt_ls.append((((fi_t[x])*((dependency.get('n_rps'))*(dependency.get('d')**3)))*1000)/3.6)
        h_m.append((psi_t[x]*(dependency.get('n_rps') * dependency.get('d'))**2) / 9.81)

    figure, axis = plt.subplots(2, 2) 

    axis[0, 0].plot(fi_t, psi_t)
    axis[0, 0].set_title("fi/psi") 

    axis[0, 1].plot(fi_t, eta_t)
    axis[0, 1].set_title("fi/eta") 

    axis[1, 0].plot(qt_ls, h_m)
    axis[1, 0].set_title("qt/h") 

    axis[1, 1].plot(qt_ls, eta_t)
    axis[1, 1].set_title("qt/eta") 


    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)

    # Converta a imagem para base64
    imagem_base64 = base64.b64encode(buf.read()).decode('utf-8')

    # Feche o gráfico para liberar recursos
    plt.close()

    return imagem_base64

eel.start('main.html', mode='default')
