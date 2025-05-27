import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { read, utils } from 'npm:xlsx@0.18.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file uploaded');
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = read(arrayBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);

    // Process the Excel data and insert into database
    for (const row of jsonData) {
      const {
        ProjectName,
        PhaseNumber,
        Month,
        PlannedTrees,
        PlannedHectares,
        ActualTrees,
        ActualHectares
      } = row as any;

      // Get or create project
      let { data: project } = await supabase
        .from('projects')
        .select()
        .eq('name', ProjectName)
        .single();

      if (!project) {
        const { data: newProject } = await supabase
          .from('projects')
          .insert({ name: ProjectName })
          .select()
          .single();
        project = newProject;
      }

      // Get or create phase
      let { data: phase } = await supabase
        .from('phases')
        .select()
        .eq('project_id', project.id)
        .eq('phase_number', PhaseNumber)
        .single();

      if (!phase) {
        const { data: newPhase } = await supabase
          .from('phases')
          .insert({ 
            project_id: project.id, 
            phase_number: PhaseNumber 
          })
          .select()
          .single();
        phase = newPhase;
      }

      // Insert monthly data
      await supabase
        .from('monthly_data')
        .upsert({
          project_id: project.id,
          phase_id: phase.id,
          month: new Date(Month).toISOString(),
          planned_trees: PlannedTrees,
          planned_hectares: PlannedHectares,
          actual_trees: ActualTrees,
          actual_hectares: ActualHectares
        }, {
          onConflict: 'project_id,phase_id,month'
        });
    }

    return new Response(
      JSON.stringify({ message: 'Data processed successfully' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});