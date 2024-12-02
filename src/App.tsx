import './index.css'
import { useRef } from "react";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
//import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'


const schema = z.object({
  fluxo_valvula: z.string().optional(),
  fluxo_valvula_unidade: z.string().optional(),
  fluxo_valvula_convertido: z.string().optional(),
  altura_valvula: z.string().optional(),
  eficiencia_estimada: z.string().optional(),
  coeficiente_vazao: z.string().optional(),
  coeficiente_altura: z.string().optional(),
  fluxo_bomba_m3s: z.string().optional(),
  fluxo_bomba_m3h: z.string().optional(),
  altura_bomba: z.string().optional(),
  rotacao_rpm: z.string().optional(),
  rotacao_rps: z.string().optional(),
  diametro_bomba: z.string().optional(),
  potencia: z.string().optional(),
  velocidade_especifica_rps: z.string().optional(),
  velocidade_especifica_rad: z.string().optional()

})
type FormData = z.infer<typeof schema>

export function App() {
  const selectRef = useRef(null);
  const { handleSubmit, register } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  function onSubmit(data: FormData){
    console.log(data)
  }
  return (
    <div className='flex items-center justify-center a h-screen w-full bg-zinc-100'>
      <div className='flex justify-center items-center p-8 w-4/4 sm:w-1/2 lg bg-white'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="bomba" className="">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bomba">Bomba</TabsTrigger>
              <TabsTrigger value="turbina">Turbina</TabsTrigger>
            </TabsList>
            <TabsContent value="bomba">
              <Card>
                <CardHeader>
                  <CardTitle>Aproveitamento da Valvula</CardTitle>
                  <CardDescription>
                    Make changes to your account here. Click save when you're done.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg gap-4'>
                    <div className='flex items-end gap-1'>
                        <div className=''>
                          <Label htmlFor="fluxo_valvula" className='w-full'>Fluxo da Valvula - Qti</Label>
                          <Input type="text" {... register('fluxo_valvula')}/>
                        </div>
                        <div>
                          <Select {...register('fluxo_valvula_unidade')}>
                            <SelectTrigger ref={selectRef} className="w-[75px]">
                              <SelectValue placeholder="unid." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="m3s">m³/s</SelectItem>
                              <SelectItem value="m3h">m³/h</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    <div>
                      <Label htmlFor="fluxo_valvula_convertido" className="block text-sm">
                        Fluxo da Valvula - Qti
                        </Label>
                      <Input disabled {... register('fluxo_valvula_convertido')}/>
                    </div>
                    <div>
                      <Label htmlFor="altura_valvula">Altura da Valvula - Hti (m)</Label>
                      <Input type="text" {... register('altura_valvula')}/>
                    </div>

                    <div>
                      <Label htmlFor="eficiencia_estimada" className="block text-sm">
                        Eficiência estimada (η<sub>b</sub>)
                      </Label>
                      <Input
                        type="text"
                        id="eficiencia_estimada"
                        className="w-full mt-1"
                        placeholder="0.7"
                        {... register('eficiencia_estimada')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="coeficiente_vazao" className="block text-sm">
                        Coeficiente de vazão (q)
                      </Label>
                      <Input
                        disabled
                        id="coeficiente_vazao"
                        className="w-full mt-1"
                        placeholder="0.00"
                        {... register('coeficiente_vazao')}
                        />
                    </div>
                    <div>
                      <Label htmlFor="coeficiente_altura" className="block text-sm">
                        Coeficiente de altura (h)
                      </Label>
                      <Input
                        disabled
                        id="coeficiente_altura"
                        className="w-full"
                        placeholder="0.00"
                        {... register('coeficiente_altura')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fluxo_bomba_m3s" className="block text-sm">
                        Fluxo - Qb (m³/s)
                      </Label>
                      <Input
                        disabled
                        id="fluxo_bomba_m3s"
                        className="w-full"
                        placeholder="0.00"
                        {... register('fluxo_bomba_m3s')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fluxo_bomba_m3h" className="block text-sm">
                        Fluxo - Qb (m³/h)
                      </Label>
                      <Input 
                        disabled 
                        id="fluxo_bomba_m3h" 
                        className="w-full" 
                        placeholder="0.00" 
                        {... register('fluxo_bomba_m3h')}
                        />
                    </div>
                    <div>
                      <Label htmlFor="altura_bomba" className="block text-sm">
                        Altura - Hb (m)
                      </Label>
                      <Input 
                        disabled 
                        id="altura_bomba" 
                        className="w-full" 
                        placeholder="0.00"
                        {... register('altura_bomba')}                      
                      />
                    </div>
                    <div>
                      <Label htmlFor="rotacao_rpm" className="block text-sm">
                        Rotação - N (rpm)
                      </Label>
                      <Input 
                        type="text" 
                        id="rotacao_rpm" 
                        className="w-full" 
                        placeholder="0000"
                        {... register('rotacao_rpm')}                      
                        />
                    </div>
                    <div>
                      <Label htmlFor="rotacao_rps" className="block text-sm">
                        Rotação - N (rps)
                      </Label>
                      <Input 
                      disabled 
                      id="rotacao_rps" 
                      className="w-full" 
                      placeholder="0000"
                      {... register('rotacao_rps')}                      
                      />
                    </div>
                    <div>
                      <Label htmlFor="diametro_bomba" className="block text-sm">
                        Diâmetro - D (m)
                      </Label>
                      <Input 
                        type="text" 
                        id="diametro_bomba" 
                        className="w-full" 
                        placeholder="0.123"
                        {... register('diametro_bomba')}                      
                      />
                    </div>
                    <div>
                      <Label htmlFor="potencia" className="block text-sm">
                        Potência - P (kWh)
                      </Label>
                      <Input 
                        disabled 
                        id="potencia" 
                        className="w-full" 
                        placeholder="00"
                        {... register('potencia')}                      
                      />
                    </div>
                    <div>
                      <Label htmlFor="velocidade_especifica_rps" className="block text-sm">
                        Velocidade específica - Ns (rps)
                      </Label>
                      <Input 
                        disabled 
                        id="velocidade_especifica_rps" 
                        className="w-full" 
                        placeholder="0000"
                        {... register('velocidade_especifica_rps')}                        
                      />
                    </div>
                    <div>
                      <Label htmlFor="velocidade_especifica_rad" className="block text-sm">
                        Velocidade específica - Ns (rad/s)
                      </Label>
                      <Input 
                        disabled 
                        id="velocidade_especifica_rad" 
                        className="w-full" 
                        placeholder="0"
                        {... register('velocidade_especifica_rad')}                        
                      />
                    </div>
                    <Button type='submit'>Save changes</Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type='submit'>Save changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="turbina">
              <Card>
                <CardHeader>
                  <CardTitle>Turbina</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                
                </CardContent>
                <CardFooter>
                  <Button>Save password</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  )
}
